import { useEffect, useState } from "react";

const apiURL = "https://api-baixos.onrender.com/baixos";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
    <circle cx="6.5" cy="6.5" r="4"/><path d="M10 10l3 3"/>
  </svg>
);
const DocIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
    <rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M5 7h6M5 10h4"/>
  </svg>
);
const LayerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
    <path d="M2 12V4l6-2 6 2v8"/><path d="M8 2v10"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
    <circle cx="8" cy="8" r="5.5"/><path d="M8 4v4.5l3 1.5"/>
  </svg>
);
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
    <path d="M8 2C5.8 2 4 3.8 4 6c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z"/><circle cx="8" cy="6" r="1.5"/>
  </svg>
);

function FieldRow({ icon, children, split }) {
  return (
    <div className={`flex items-center gap-2.5 px-3.5 border-b border-gray-100 last:border-0 ${split ? "divide-x divide-gray-100" : ""}`}>
      <span className="shrink-0 opacity-40">{icon}</span>
      {children}
    </div>
  );
}

function FieldInput({ placeholder, value, onChange, small }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`flex-1 bg-transparent border-none outline-none py-3 text-sm text-gray-800 placeholder-gray-400 ${small ? "max-w-[80px]" : ""}`}
    />
  );
}

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
      if (cordasSelecionadas.length > 0) url += `numCordas=${cordasSelecionadas.join(",")}&`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro ao buscar API!");
      const data = await response.json();
      setBaixos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMarca(""); setModelo(""); setLinha("");
    setPaisFab(""); setAno("");
    setCordas4(false); setCordas5(false); setCordas6(false);
    fetchBaixos();
  }

  useEffect(() => { fetchBaixos(); }, []);

  if (loading) return <div className="p-6 text-center text-lg">Carregando...</div>;
  if (error) return <div className="p-6 text-center text-lg text-red-500">Erro: {error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-5"><u>Catálogo de Contrabaixos</u></h1>

      {/* Campo de busca */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Buscar instrumento</p>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-3 shadow-sm">
        <FieldRow icon={<SearchIcon />}>
          <FieldInput placeholder="Marca (ex: Fender, Ibanez...)" value={marca} onChange={e => setMarca(e.target.value)} />
        </FieldRow>
        <FieldRow icon={<DocIcon />}>
          <FieldInput placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
        </FieldRow>
        <FieldRow icon={<LayerIcon />} split>
          <FieldInput placeholder="Linha" value={linha} onChange={e => setLinha(e.target.value)} />
          <div className="flex items-center gap-2.5 pl-3">
            <span className="shrink-0 opacity-40"><ClockIcon /></span>
            <FieldInput placeholder="Ano" value={ano} onChange={e => setAno(e.target.value)} small />
          </div>
        </FieldRow>
        <FieldRow icon={<PinIcon />}>
          <FieldInput placeholder="País de fabricação" value={paisFab} onChange={e => setPaisFab(e.target.value)} />
        </FieldRow>
      </div>

      {/* Filtro de cordas */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Número de cordas</p>
      <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3 flex gap-2 shadow-sm">
        {[
          { label: "4 cordas", value: cordas4, set: setCordas4 },
          { label: "5 cordas", value: cordas5, set: setCordas5 },
          { label: "6 cordas", value: cordas6, set: setCordas6 },
        ].map(({ label, value, set }) => (
          <button
            key={label}
            onClick={() => set(!value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              value
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${value ? "bg-blue-500" : "bg-gray-300"}`}></span>
            {label}
          </button>
        ))}
      </div>

      {/* Botões */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={fetchBaixos}
          className="flex-1 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          Buscar
        </button>
        <button
          onClick={handleClear}
          className="px-5 py-2.5 border border-gray-200 text-gray-500 rounded-lg text-sm hover:border-gray-300 transition-colors"
        >
          Limpar
        </button>
      </div>

      {/* Resultados */}
      {baixos.length === 0 ? (
        <p className="text-center text-gray-400 mt-8">Nenhum contrabaixo encontrado</p>
      ) : (
        <div className="grid gap-3">
          {baixos.map((baixo) => (
            <div key={baixo.id} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm hover:shadow transition">
              <h2 className="font-semibold text-gray-800">{baixo.marca} — {baixo.linha}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {baixo.modelo} · {baixo.numCordas} cordas · {baixo.paisFab} · {baixo.ano}
              </p>
              <br/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
