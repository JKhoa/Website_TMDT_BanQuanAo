import { Link } from "react-router";

export function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group relative aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
