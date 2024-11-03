<script lang="ts">
  import { onMount } from "svelte";
  import {
    deleteProject,
    editProject,
    executeProject,
    getProjectList,
  } from "../api/webhook";
  let curPage = 1;
  let list: IWebhookData[] = [];

  async function getList() {
    const res = await getProjectList(curPage);
    list = res.data;
  }

  onMount(async () => {
    await getList();
  });

  // Execute Project
  async function onExecute(projectName: string) {
    const isExecute = confirm(
      `Confirm to execute webhook project ${projectName}?`
    );

    if (!isExecute) return;

    const result = await executeProject(projectName);

    alert(result.success ? "success" : "fail");
  }

  // Delete Project
  async function onDelete(projectName: string) {
    const isExecute = confirm(`Confirm to delete project ${projectName}?`);

    if (!isExecute) return;

    const result = await deleteProject(projectName);

    alert(result.success ? "success" : "fail");

    getList();
  }

  // Set status, it will reverse the current value
  async function onSetStatus(item: IWebhookData) {
    const isExecute = confirm(`Confirm to change status ?`);

    if (!isExecute) return;

    const result = await editProject(item.name, { status: !item.status });

    alert(result.success ? "success" : "fail");

    getList();
  }
</script>

<table>
  <thead>
    <tr>
      {#each Object.keys(list[0] ?? []) as item}
        <th>{item}</th>
      {/each}
      <th>Control</th>
    </tr>
  </thead>
  <tbody>
    {#each list as row}
      <tr>
        {#each Object.entries(row) as [_, value]}
          <td>{value}</td>
        {/each}
        <td>
          <button on:click={() => onExecute(row.name)}>Execute</button>
          <button on:click={() => onSetStatus(row)}>Set Status</button>
          <button on:click={() => onDelete(row.name)}>Delete</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  th {
    text-align: left;
    min-width: 100px;
  }
  td {
    word-break: break-all;
  }
  td > button {
    width: 80px;
    margin-bottom: 5px;
    cursor: pointer;
  }
  tbody > tr > td {
    padding: 10px;
  }
  tbody > tr:nth-child(odd) {
    background: #f5f5f5;
  }
</style>
