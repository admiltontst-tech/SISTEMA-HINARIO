/* Busca o vídeo de um hino no YouTube (nome + cantor) e devolve as primeiras opções.
   A chave fica só na Vercel: Settings > Environment Variables > YOUTUBE_API_KEY. */
module.exports = async function (req, res) {
  const q = String((req.query && req.query.q) || "").trim().slice(0, 150);
  const chave = process.env.YOUTUBE_API_KEY;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (!q) { res.statusCode = 400; return res.end(JSON.stringify({ erro: "sem-busca" })); }
  if (!chave) { res.statusCode = 503; return res.end(JSON.stringify({ erro: "sem-chave" })); }
  const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=5" +
    "&regionCode=BR&relevanceLanguage=pt&q=" + encodeURIComponent(q) + "&key=" + encodeURIComponent(chave);
  try {
    const r = await fetch(url);
    const d = await r.json();
    if (!r.ok) { res.statusCode = 502; return res.end(JSON.stringify({ erro: (d.error && d.error.errors && d.error.errors[0] && d.error.errors[0].reason) || "youtube" })); }
    const videos = (d.items || []).filter((x) => x.id && x.id.videoId).map((x) => ({
      id: x.id.videoId, titulo: x.snippet.title, canal: x.snippet.channelTitle
    }));
    /* a mesma busca fica guardada por um dia na Vercel, para poupar a cota grátis do YouTube */
    res.setHeader("Cache-Control", "public, s-maxage=86400");
    res.end(JSON.stringify({ videos }));
  } catch (e) {
    res.statusCode = 502; res.end(JSON.stringify({ erro: "rede" }));
  }
};
