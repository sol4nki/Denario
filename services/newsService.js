const fetchNews = async (limit = 10) => {
  try {
    const url = `//add api here, removed by us`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.Data || [];
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export default fetchNews;
