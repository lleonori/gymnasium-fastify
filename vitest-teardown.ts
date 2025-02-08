import PgDockerController from "./__test__/PgDockerController.js";

export async function setup() {
  await teardown();
}

export async function teardown() {
  await Promise.all([PgDockerController.cleanUp()]);
}
