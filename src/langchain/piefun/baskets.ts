import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";

export class PieFunListAllBaskets extends Tool {
  name = "piefun_list_all_baskets";
  description = `List all baskets that are available on Pie.Fun (PieFun)

  Inputs: None`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  async _call(): Promise<string> {
    try {
      const response = await this.solanaKit.listAllBaskets();
      return JSON.stringify(response);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
      });
    }
  }
}

export class PieFunGetAllBasketTokenBalance extends Tool {
  name = "piefun_get_all_basket_token_balance";
  description = `Get all basket token balance for a given owner.`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  async _call(): Promise<string> {
    try {
      const response = await this.solanaKit.getAllBasketTokenBalance();
      return JSON.stringify(response);
    } catch (error: any) {
      console.log({ error });
      return JSON.stringify({
        status: "error",
        message: error.message,
      });
    }
  }
}

export class PieFunBuyBasket extends Tool {
  name = "piefun_buy_basket";
  description = `Buy a basket from Pie.Fun (PieFun)`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  async _call(): Promise<string> {
    try {
      const response = await this.solanaKit.buyBasket();
      return JSON.stringify(response);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
      });
    }
  }
}

export class PieFunSellBasket extends Tool {
  name = "piefun_sell_basket";
  description = `Sell a basket from Pie.Fun (PieFun)`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  async _call(): Promise<string> {
    try {
      const response = await this.solanaKit.sellBasket();
      return JSON.stringify(response);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
      });
    }
  }
}
