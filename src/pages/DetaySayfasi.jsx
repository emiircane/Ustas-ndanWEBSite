import { useParams } from "react-router-dom";

function DetaySayfasi() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Detay Sayfası</h1>
      <p>Burada ustanın bilgileri yer alacak. ID: {id}</p>
    </div>
  );
}

export default DetaySayfasi;
