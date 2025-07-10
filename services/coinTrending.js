const fetchTrendingTokens = async () => {
  try {
    const response = await fetch(
      "//add api here, removed by us ",
    );
    if (!response.ok) throw new Error("Failed to fetch trending tokens");
    const data = await response.json();

    const transformedCoins = data.coins.map((coin) => ({
      id: coin.item.id,
      name: coin.item.name,
      image: coin.item.thumb,
      small: coin.item.small,
      price: coin.item.data?.price,
      description: coin.item.data?.content?.description || "",
      trending: true,
    }));

    return transformedCoins;
  } catch (error) {
    console.error("Error fetching trending tokens:", error);
    return [];
  }
};

export default fetchTrendingTokens;
