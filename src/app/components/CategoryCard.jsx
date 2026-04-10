import { Link } from "react-router";
import { resolveImageUrl } from "../utils/imageUrl";

export function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <img
        src={resolveImageUrl(category.image)}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDYwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9IiNmM2Y0ZjYiLz48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iOCI+PHJlY3QgeD0iMTQwIiB5PSIxNDAiIHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiByeD0iMjQiLz48cGF0aCBkPSJtMTQwIDM2MCA5NS05NSAxMjAgMTIwIDcwLTcwIDM1IDM1Ii8+PGNpcmNsZSBjeD0iMzQwIiBjeT0iMjQwIiByPSIzMiIvPjwvZz48L3N2Zz4='; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
        <div className="p-6 text-white w-full">
          <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
          <p className="text-sm opacity-90">{category.subcategories.length} danh mục</p>
        </div>
      </div>
    </Link>
  );
}
