import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";

export class ListTopSolanaMindshareTokens extends Tool {
  name = "list_top_solana_mindshare_tokens";
  description = `List all the top Solana Mindshare tokens on Cookie.Fun

  Inputs: None`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  async _call(): Promise<string> {
    try {
      const response = await this.solanaKit.listTopSolanaMindshareTokens();
      return JSON.stringify(response);
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
      });
    }
  }
}
