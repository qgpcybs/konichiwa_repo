import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider } from "@dojoengine/core";
import { Account, num } from "starknet";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/graphql";
import manifest from "../../../dojo-starter/target/dev/manifest.json";
import * as torii from "@dojoengine/torii-client";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {
    // Extract environment variables for better readability.
    const {
        VITE_PUBLIC_WORLD_ADDRESS,
        VITE_PUBLIC_NODE_URL,
        VITE_PUBLIC_TORII,
    } = import.meta.env;

    // Create a new RPCProvider instance.
    const provider = new RPCProvider(
        VITE_PUBLIC_WORLD_ADDRESS,
        manifest,
        VITE_PUBLIC_NODE_URL
    );

    const createGraphSdk = () =>
        getSdk(new GraphQLClient(VITE_PUBLIC_TORII + "/graphql"));

    const torii_client = await torii.createClient([], {
        rpcUrl: VITE_PUBLIC_NODE_URL,
        toriiUrl: VITE_PUBLIC_TORII,
        worldAddress: VITE_PUBLIC_WORLD_ADDRESS,
    });

    // Return the setup object.
    return {
        provider,
        world,
        torii_client,

        // Define contract components for the world.
        contractComponents: defineContractComponents(world),

        // Define the graph SDK instance.
        graphSdk: createGraphSdk,

        // Execute function.
        execute: async (
            signer: Account,
            contract: string,
            system: string,
            call_data: num.BigNumberish[]
        ) => {
            return provider.execute(signer, contract, system, call_data);
        },
    };
}
