import { runRpc } from "utils/rpc";

export const assignDivisionToHouse = async (
  selectedRowIds,
  gos_subdivision
) => {
  const cs_house = await runRpc({
    action: "cs_house",
    method: "Query",
    data: [
      {
        limit: 1000,
        filter: [
          {
            property: "id",
            value: Object.keys(selectedRowIds).map((id) => `'${id}'`),
            operator: "in",
          },
        ],
      },
    ],
    type: "rpc",
  });
  const house = cs_house.result.records;

  const houseWithGos = [];
  const houseWithOutGos = [];
  house.forEach((item) => {
    if (item.n_gos_subdivision) {
      houseWithGos.push(item);
    } else {
      houseWithOutGos.push(item);
    }
  });

  if (houseWithOutGos && houseWithOutGos.length) {
    await runRpc({
      action: "cs_house",
      method: "Update",
      data: [
        houseWithOutGos.map((item) => ({ id: item.id, n_gos_subdivision: gos_subdivision })),
      ],
      type: "rpc",
    });
  }

  return {
    houseWithGos
  }
};

export const assignApproveDivisionToHouse = async (
  houseWithGos,
  gos_subdivision
) => {

  if (houseWithGos && houseWithGos.length) {
    await runRpc({
      action: "cs_house",
      method: "Update",
      data: [
        houseWithGos.map((item) => ({ id: item.id, n_gos_subdivision: gos_subdivision })),
      ],
      type: "rpc",
    });
  }
}