// Define the component type as a struct/interface
export interface BasketComponent {
  mint: string;       // The token mint address
  poolType: string;   // The pool type (e.g., "POOL_TYPE_CLMM", "POOL_TYPE_CPMM", "POOL_TYPE_AMM")
  quantity: string;   // The token quantity as a string
  poolId?: string;    // Optional poolId for the token pool
}

// Define token pool type
export interface TokenPool {
  name: string;       // Can be empty string
  mint: string;       // The token mint address
  poolId: string;     // The pool ID
  lookupTable: string; // Can be empty string
  poolType: string;   // The pool type
}

// Define the create basket parameters interface
export interface CreateBasketParams {
  gateway: string;             // The API gateway URL
  name: string;                // The name of the basket
  symbol: string;              // The symbol of the basket
  uri: string;                 // The metadata URI for the basket
  components: BasketComponent[]; // Array of basket components
}

// Pool type constants
export const POOL_TYPES = {
  CLMM: "POOL_TYPE_CLMM",
  CPMM: "POOL_TYPE_CPMM",
  AMM: "POOL_TYPE_AMM"
} as const;

// Define the mapping from Raydium pool types to our pool types
const RAYDIUM_POOL_TYPE_MAPPING = {
  "Clmm": POOL_TYPES.CLMM,
  "Cpmm": POOL_TYPES.CPMM,
  "Ecosystem": POOL_TYPES.AMM, // Based on the data, "Ecosystem" maps to Standard which is AMM
  "Standard": POOL_TYPES.AMM
};

/**
 * Fetches pool IDs for the given token mints
 * @param components Array of basket components
 * @returns Promise with updated components with poolIds
 */
async function fetchPoolIds(components: BasketComponent[]): Promise<BasketComponent[]> {
  const updatedComponents = [...components];

  // Process each component
  for (let i = 0; i < components.length; i++) {
    const component = components[i];

    // Skip if poolId is already provided
    if (component.poolId) {
      continue;
    }

    try {
      // Fetch pool info for the mint
      const url = `https://api-v3.raydium.io/pools/info/mint?mint1=${component.mint}&poolType=all&poolSortField=liquidity&sortType=desc&pageSize=10&page=1`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`Failed to fetch pool info for mint ${component.mint}: ${response.status} ${response.statusText}`);
        continue;
      }

      const data = await response.json();

      // Find the first pool with matching poolType
      let poolId = null;
      const targetPoolType = component.poolType;

      if (data.success && data.data && data.data.data && data.data.data.length > 0) {
        // First, try to find an exact match based on the rewardDefaultPoolInfos mapping to our poolType
        for (const pool of data.data.data) {
          const poolTypeFromRaydium = RAYDIUM_POOL_TYPE_MAPPING[pool.rewardDefaultPoolInfos] ;
          if (poolTypeFromRaydium === targetPoolType) {
            poolId = pool.id;
            break;
          }
        }

        // If no match was found, try to find a match based on the type field
        if (!poolId) {
          for (const pool of data.data.data) {
            // Map Concentrated to CLMM and Standard to AMM
            const typeMapping = {
              "Concentrated": POOL_TYPES.CLMM,
              "Standard": POOL_TYPES.AMM
            };

            const poolTypeFromType = typeMapping[pool.type];
            if (poolTypeFromType === targetPoolType) {
              poolId = pool.id;
              break;
            }
          }
        }

        // If still no match, just use the first pool's ID
        if (!poolId && data.data.data.length > 0) {
          poolId = data.data.data[0].id;
          console.warn(`No exact pool type match for ${component.mint}, using first available pool: ${poolId}`);
        }
      }

      if (poolId) {
        updatedComponents[i] = {
          ...component,
          poolId
        };
      } else {
        console.warn(`No pool found for mint ${component.mint}`);
      }
    } catch (error) {
      console.error(`Error fetching pool info for mint ${component.mint}:`, error);
    }
  }

  return updatedComponents;
}

/**
 * Creates token pools for basket components
 * @param gateway The base URL for API
 * @param components Array of basket components with poolIds
 * @returns Promise with the created token pools
 */
async function createTokenPools(gateway: string, components: BasketComponent[]): Promise<any> {
  try {
    if (gateway === "") {
        gateway = "https://pie-program-client-1032702417000.asia-east1.run.app/v1/pie-program";
    }
    // Transform components to token pools format
    const tokenPools = components.map(component => ({
      name: "",
      mint: component.mint,
      poolId: component.poolId || "", // Use provided poolId or empty string
      lookupTable: "",
      poolType: component.poolType
    }));

    const response = await fetch(`${gateway}/token-pools/batchCreate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tokenPools
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Failed to create token pools: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating token pools:', error);
    throw error;
  }
}

/**
 * Creates a new basket with the specified parameters
 * First fetches pool IDs, then creates token pools, and finally creates the basket
 *
 * @param params The basket creation parameters
 * @returns Promise with the created basket data
 */
export async function createBasket({ gateway, name, symbol, uri, components }: CreateBasketParams) {
  try {
    // Step 1: Fetch pool IDs for components that don't have them
    const componentsWithPoolIds = await fetchPoolIds(components);
    console.log('Components with pool IDs:', componentsWithPoolIds);

    // Step 2: Create token pools for all components
    const tokenPoolsResult = await createTokenPools("", componentsWithPoolIds);
    console.log('Token pools created:', tokenPoolsResult);

    // Step 3: Create the basket
    const response = await fetch(`${gateway}/command/create-basket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        symbol,
        uri,
        components: componentsWithPoolIds
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Failed to create basket: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating basket:', error);
    throw error;
  }
}

// Example usage:
/*
const basketData: CreateBasketParams = {
  gateway: "https://api.example.com",
  name: "Solana Top Picks",
  symbol: "LFG",
  uri: "https://cdn.internal-pie.fun/basket/2q5dnpd/metadata",
  components: [
    {
      mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
      poolType: POOL_TYPES.CLMM,
      quantity: "6018242",
      // poolId is optional and will be fetched if not provided
    },
    {
      mint: "KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS",
      poolType: POOL_TYPES.CLMM,
      quantity: "28851"
    }
    // ... other components
  ]
};

createBasket(basketData)
  .then(result => console.log('Basket created:', result))
  .catch(error => console.error('Failed to create basket:', error));
*/
