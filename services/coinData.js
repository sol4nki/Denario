const fetchCoinData = async ({ coinId }) => {
  const response = await fetch(
    //add api here, removed by us 
    {
      headers: {
        Authorization: process.env.COINGECKO_API_KEY,
        "Content-Type": "application/json",
      },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch coin data");

  const data = await response.json();
  return data;
};

const fetchCoinMarketChart = async ({ coinId, from, to }) => {
  const response = await fetch(
    //add api here, removed by us 
    {
      headers: {
        Authorization: process.env.COINGECKO_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    },
  );
  if (!response.ok) throw new Error("Failed to fetch market chart data");

  const data = await response.json();
  return data;
};

export default fetchCoinData;
export { fetchCoinMarketChart };
