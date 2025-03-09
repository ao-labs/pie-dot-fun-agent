import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";
import {CreateBasketParams} from "@/src/tools/piefun/create_basket";

export class PieFunCreateBasket extends Tool {
  name = "piefun_create_basket";
  description = `Create a basket on Pie.Fun (PieFun)
  
  Inputs: None`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  async _call(params: CreateBasketParams): Promise<string> {
    try {
      const response = await this.solanaKit.createBasket(params);
      return JSON.stringify(response);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
      });
    }
  }
}
