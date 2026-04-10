import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
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
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAAA0J1ZwAAAAADAAAAAAAAAAtkZXNjcmlwdGlvbgAAAAAQAAAAAAAAAAhyZXBvcnRlcgAAABMAAAAAAAAABnN0YXR1cwAAAAAAEQ==",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAAAgAAAAEAAAAAAAAAA0J1ZwAAAAABAAAAEQAAAAAAAAAAAAAAB0J1Z0xpc3QA",
            "AAAAAAAAAAAAAAAHZ2V0X2J1ZwAAAAABAAAAAAAAAAJpZAAAAAAAEQAAAAEAAAfQAAAAA0J1ZwA=",
            "AAAAAAAAAAAAAAAJY2xvc2VfYnVnAAAAAAAAAQAAAAAAAAACaWQAAAAAABEAAAAA",
            "AAAAAAAAAAAAAAAJbGlzdF9idWdzAAAAAAAAAAAAAAEAAAPqAAAAEQ==",
            "AAAAAAAAAAAAAAAKY3JlYXRlX2J1ZwAAAAAAAwAAAAAAAAACaWQAAAAAABEAAAAAAAAACHJlcG9ydGVyAAAAEwAAAAAAAAALZGVzY3JpcHRpb24AAAAAEAAAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        get_bug: (this.txFromJSON),
        close_bug: (this.txFromJSON),
        list_bugs: (this.txFromJSON),
        create_bug: (this.txFromJSON)
    };
}
