import Head from "next/head";
import { ReactElement } from "react";
import { Pathfind } from "../components/Pathfind";

export default function Home(): ReactElement {
    return (
        <div>
            <Head>
                <title>Path Visualizer</title>
                <meta name="description" content="Path visualizer app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <Pathfind
                    GRID_ROWS={20}
                    GRID_COLUMNS={50}
                    FINISH_NODE_COLUMN={34}
                    FINISH_NODE_ROW={3}
                    START_NODE_COLUMN={30}
                    START_NODE_ROW={10}
                />
            </main>
        </div>
    );
}
