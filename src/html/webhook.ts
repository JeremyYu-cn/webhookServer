export function createListTable(list: IWebhookData[]) {
  let html = `
    <table>
      <thead>{tHead}</thead>
      <tbody>{tBody}<tbody>
    </table>`;
  const tHead = Object.keys(list[0])
    .map((val) => {
      return `<th>${val}</th>`;
    })
    .join("");
  const tBody = list
    .map((val) => {
      const td = Object.keys(val)
        .map((t) => {
          return `<td>${(<Record<string, any>>val)[t]}</td>`;
        })
        .join("");
      return `<tr>${td}</tr>`;
    })
    .join("");

  return html.replace("{tHead}", tHead).replace("{tBody}", tBody);
}
