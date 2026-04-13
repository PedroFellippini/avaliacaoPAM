import { useEffect, useState } from "react";

const apiURL = "https://api-baixos.onrender.com/baixos";

export default function App() {
  const [baixos, setBaixos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [linha, setLinha] = useState("");
  const [paisFab, setPaisFab] = useState("");
  const [ano, setAno] = useState("");

  const [cordas4, setCordas4] = useState(false);
  const [cordas5, setCordas5] = useState(false);
  const [cordas6, setCordas6] = useState(false);

  async function fetchBaixos() {
    try {
      setLoading(true);

      let url = apiURL + "?";

      if (marca) url += `marca=${marca}&`;
      if (modelo) url += `modelo=${modelo}&`;
      if (linha) url += `linha=${linha}&`;
      if (paisFab) url += `paisFab=${paisFab}&`;
      if (ano) url += `ano=${ano}&`;

      const cordasSelecionadas = [];
      if (cordas4) cordasSelecionadas.push(4);
      if (cordas5) cordasSelecionadas.push(5);
      if (cordas6) cordasSelecionadas.push(6);

      if (cordasSelecionadas.length > 0) {
        url += `numCordas=${cordasSelecionadas.join(",")}&`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Erro ao buscar API!");
      }

      const data = await response.json();
      setBaixos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBaixos();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-lg">Carregando API info</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-lg">Erro: {error}.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Catálogo de Contrabaixos</h1>

      <div className="grid gap-2 mb-4">
        <input
          type="text"
          placeholder="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Linha"
          value={linha}
          onChange={(e) => setLinha(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="País de fabricação"
          value={paisFab}
          onChange={(e) => setPaisFab(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Ano"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
          className="border p-2 rounded"
        />

        <div className="flex gap-4 mt-2">
          <label>
            <input
              type="checkbox"
              checked={cordas4}
              onChange={() => setCordas4(!cordas4)}
            />
            4 cordas
          </label>

          <label>
            <input
              type="checkbox"
              checked={cordas5}
              onChange={() => setCordas5(!cordas5)}
            />
            5 cordas
          </label>

          <label>
            <input
              type="checkbox"
              checked={cordas6}
              onChange={() => setCordas6(!cordas6)}
            />
            6 cordas
          </label>
        </div>

        <button
          onClick={fetchBaixos}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Filtrar
        </button>
        <button
          onClick={() => {
            setMarca("");
            setModelo("");
            setLinha("");
            setPaisFab("");
            setAno("");
            setCordas4(false);
            setCordas5(false);
            setCordas6(false);
            fetchBaixos();
          }}
        >
          Limpar filtros
        </button>
      </div>

      <div className="grid gap-4">
        {baixos.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            Nenhum contrabaixo encontrado
          </div>
        ) : (
          <div className="grid gap-4">
            {baixos.map((baixo) => (
              <div
                key={baixo.id}
                className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold">
                  {baixo.marca} - {baixo.linha}
                </h2>
                <p>Modelo: {baixo.modelo}</p>
                <p>Cordas: {baixo.numCordas}</p>
                <p>País: {baixo.paisFab}</p>
                <p>Ano: {baixo.ano}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}