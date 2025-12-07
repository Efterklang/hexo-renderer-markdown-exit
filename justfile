build:
    bun build src/index.ts --outdir dist
check:
    bunx biome check --write .
