import PgDockerController from "./__test__/PgDockerController.ts";

export async function setup() {
  await teardown();
}

export async function teardown() {
  await Promise.all([PgDockerController.cleanUp()]);
}
