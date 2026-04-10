import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CAYO56YYDFQ3JY7AFS7QK6ZRY6XLFXI5TP7UPIMBDMES2WLWHPPZXNXQ",
  }
} as const


export interface Bug {
  description: string;
  reporter: string;
  status: string;
}

export type DataKey = {tag: "Bug", values: readonly [string]} | {tag: "BugList", values: void};

export interface Client {
  /**
   * Construct and simulate a get_bug transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_bug: ({id}: {id: string}, options?: MethodOptions) => Promise<AssembledTransaction<Bug>>

  /**
   * Construct and simulate a close_bug transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  close_bug: ({id}: {id: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a list_bugs transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  list_bugs: (options?: MethodOptions) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a create_bug transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_bug: ({id, reporter, description}: {id: string, reporter: string, description: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAA0J1ZwAAAAADAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAhyZXBvcnRlcgAAABMAAAAAAAAABnN0YXR1cwAAAAAAEQ==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAAA0J1ZwAAAAABAAAAEQAAAAAAAAAAAAAAB0J1Z0xpc3QA",
        "AAAAAAAAAAAAAAAHZ2V0X2J1ZwAAAAABAAAAAAAAAAJpZAAAAAAAEQAAAAEAAAfQAAAAA0J1ZwA=",
        "AAAAAAAAAAAAAAAJY2xvc2VfYnVnAAAAAAAAAQAAAAAAAAACaWQAAAAAABEAAAAA",
        "AAAAAAAAAAAAAAAJbGlzdF9idWdzAAAAAAAAAAAAAAEAAAPqAAAAEQ==",
        "AAAAAAAAAAAAAAAKY3JlYXRlX2J1ZwAAAAAAAwAAAAAAAAACaWQAAAAAABEAAAAAAAAACHJlcG9ydGVyAAAAEwAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_bug: this.txFromJSON<Bug>,
        close_bug: this.txFromJSON<null>,
        list_bugs: this.txFromJSON<Array<string>>,
        create_bug: this.txFromJSON<null>
  }
}