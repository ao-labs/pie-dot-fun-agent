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
