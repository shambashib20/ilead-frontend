export function getCurrentLeads() {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve({
        msg: "Data Fetched SuccessFully",
        data: [
          {
            id: 1,
          },
        ],
      });
    }, 3000);
  });
}
