//add api here, removed by us  const url = ;
const fetchCoinList = async () => {
  const response = await fetch(url, {
    headers: {
      Authorization: process.env.COINGECKO_API_KEY,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });
  if (!response.ok) throw new Error("Failed to fetch coin list");

  const data = await response.json();
  return data;
};

export default fetchCoinList;
