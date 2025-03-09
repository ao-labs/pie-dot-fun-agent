import { createBasket, POOL_TYPES, CreateBasketParams } from "../../src/tools/piefun";

/**
 * createBasket 함수를 테스트하는 코드
 */
async function testCreateBasket() {
  try {
    console.log('테스트 시작: createBasket 함수');

    // 테스트용 기본 설정
    const gateway = 'http://localhost:3000/v1/pie-program';

    // 테스트 데이터
    const basketData: CreateBasketParams = {
      gateway,
      name: "Solana Top Picks",
      symbol: "LFG",
      uri: "https://cdn.internal-pie.fun/basket/2q5dnpd/metadata",
      components: [
        {
          mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          poolType: POOL_TYPES.CLMM,
          quantity: "6018242"
        },
        {
          mint: "So11111111111111111111111111111111111111112",
          poolType: POOL_TYPES.CLMM,
          quantity: "28851"
        },
        {
          mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
          poolType: POOL_TYPES.AMM,
          quantity: "5834"
        }
      ]
    };

    // 1. 풀 ID 페칭 과정만 테스트
    // 비동기 코드를 모킹하여 테스트
    // const fetchMock = global.fetch;
    let fetchCalls = 0;

    // fetch를 임시로 오버라이드
    // global.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    //
    //   const url = input.toString(); // URL 또는 Request 객체를 문자열로 변환
    //   fetchCalls++;
    //   console.log(`API 호출 ${fetchCalls}: ${url}`);
    //
    //   // 풀 정보 요청 모킹
    //   if (url.includes('/pools/info/mint')) {
    //     const mint = new URL(url).searchParams.get('mint1');
    //     console.log(`민트 ${mint}에 대한 풀 정보 요청`);
    //
    //     // 샘플 응답
    //     return {
    //       ok: true,
    //       json: async () => ({
    //         success: true,
    //         data: {
    //           count: 1,
    //           data: [
    //             {
    //               id: `pool-id-for-${mint}`,
    //               type: 'Concentrated',
    //               rewardDefaultPoolInfos: 'Clmm'
    //             }
    //           ]
    //         }
    //       })
    //     } as Response;
    //   }
    //
    //   // 토큰 풀 생성 요청 모킹
    //   if (url.includes('/token-pools/batchCreate')) {
    //     // console.log('토큰 풀 생성 요청:', options?.body);
    //     return {
    //       ok: true,
    //       json: async () => ({
    //         success: true,
    //         message: '토큰 풀 생성 성공'
    //       })
    //     } as Response;
    //   }
    //
    //   // 바스켓 생성 요청 모킹
    //   if (url.includes('/command/create-basket')) {
    //     // console.log('바스켓 생성 요청:', options?.body);
    //     return {
    //       ok: true,
    //       json: async () => ({
    //         id: 'new-basket-id',
    //         success: true,
    //         message: '바스켓 생성 성공'
    //       })
    //     } as Response;
    //   }
    //
    //   return {
    //     ok: false,
    //     status: 404,
    //     statusText: 'Not Found'
    //   } as Response;
    // };

    try {
      // createBasket 함수 호출
      console.log('createBasket 함수 호출...');
      const result = await createBasket(basketData);

      // 결과 확인
      console.log('테스트 성공!');
      console.log('결과:', JSON.stringify(result, null, 2));
    } finally {
      // 원래 fetch 함수 복원
      // global.fetch = fetchMock;
    }

  } catch (error) {
    console.error('테스트 실패:', error);
  }
}

// 테스트 실행
testCreateBasket()
  .then(() => console.log('모든 테스트 완료'))
  .catch(err => console.error('테스트 실행 중 오류 발생:', err));

/**
 * 실제 프로덕션 환경에서의 사용 예시
 */
async function productionExample() {
  try {
    const basketData: CreateBasketParams = {
      gateway: "http://localhost:3000/v1/pie-program",
      name: "Solana Top Picks",
      symbol: "LFG",
      uri: "https://cdn.internal-pie.fun/basket/2q5dnpd/metadata",
      components: [
        {
          mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
          poolType: POOL_TYPES.CLMM,
          quantity: "6018242"
        },
        {
          mint: "KMNo3nJsBXfcpJTVhZcXLW7RmTwTt4GVFE7suUBo9sS",
          poolType: POOL_TYPES.CLMM,
          quantity: "28851"
        },
        {
          mint: "DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7",
          poolType: POOL_TYPES.CLMM,
          quantity: "5834"
        },
        // 추가 컴포넌트...
      ]
    };

    const result = await createBasket(basketData);
    console.log('바스켓 생성 완료:', result);

  } catch (error) {
    console.error('바스켓 생성 실패:', error);
  }
}

productionExample(); // 실제 환경에서 테스트할 때 주석 해제
