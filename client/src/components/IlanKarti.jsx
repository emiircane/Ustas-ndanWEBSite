import { Link } from "react-router-dom";

function IlanKarti({ isim, meslek, puan, resim }) {
  return (
    <div className="w-64 bg-white shadow-md rounded-lg overflow-hidden">
      <img src={resim} alt={isim} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{isim}</h3>
        <p className="text-gray-600">{meslek}</p>
        <p className="mt-2 text-yellow-500">⭐ {puan}</p>
        <Link to={`/detay/${isim}`} className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          Detaya Git
        </Link>
      </div>
    </div>
  );
}

export default IlanKarti;
