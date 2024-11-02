const url = "http://localhost:10010/api/webhook/project";

describe("test webhook server", () => {
  test("get webhook project list", async () => {
    const res = await fetch(`${url}/list`);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.err).toBe(null);
  });

  test("get webhook project detail", async () => {
    const res = await fetch(`${url}/detail/project_1`);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).not.toBeNull();
    expect(json.err).toBe(null);
  });

  test("create webhook project record", async () => {
    const res = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test_delete",
        status: false,
        list: [],
      }),
    });
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBe(null);
    expect(json.err).toBe(null);
  });

  test("create webhook project record fail with same project name", async () => {
    const res = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "project_13",
        status: false,
        list: [],
      }),
    });
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.data).toBe(null);
    expect(json.err).toBe(null);
  });

  test("modify webhook project record", async () => {
    const res = await fetch(`${url}/test_delete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: true,
        list: ["http://localhost:10010/api/test/{projectName}"],
      }),
    });
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBe(null);
    expect(json.err).toBe(null);
  });

  test("delete webhook project", async () => {
    const res = await fetch(`${url}/test_delete`, {
      method: "DELETE",
    });
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBe(null);
    expect(json.err).toBe(null);
  });

  test("execute webhook", () => {
    return new Promise(async (resolve) => {
      const res = await fetch(`${url}/exec/project_11`, {
        method: "POST",
      });
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.err).toBe(null);
      setTimeout(async () => {
        console.log(`${url}/exec/${json.data.requestId}`);
        const dataRes = await fetch(`${url}/exec/${json.data.requestId}`);
        const dataJson = await dataRes.json();
        console.log(dataJson);
        expect(json.success).toBe(true);
        resolve(true);
      }, 1000);
    });
  });
});
