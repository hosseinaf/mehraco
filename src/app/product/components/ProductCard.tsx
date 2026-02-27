import { FC } from "react";

type ProductCardProps = {
  name: string;
  storage: string;
  color: string;
  camera: string;
  shipping: string;
  price: string;

  // optional extras used for promotional display
  imageUrl?: string;
  discount?: string; // e.g. "10%"
  oldPrice?: string; // original crossed‑out price
};

export const ProductCard: FC<ProductCardProps> = ({
  name,
  storage,
  color,
  camera,
  shipping,
  price,
  imageUrl,
  discount,
  oldPrice,
}) => {
  return (
    <article className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      <div className="flex flex-1 items-center justify-center">
        <div className="aspect-3/5 w-full max-w-64 sm:max-w-35 rounded-2xl bg-neutral-100 overflow-hidden transition-transform duration-300 hover:scale-105">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-between px-4 py-3">
              <div className="mt-1 h-1 w-10 rounded-full bg-neutral-300" />
              <div className="mb-1 h-1.5 w-12 rounded-full bg-neutral-300" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-neutral-900">{name}</h3>
        {(storage || color) && (
          <p className="text-xs text-neutral-500">
            {storage}
            {storage && color ? " · " : ""}
            {color}
          </p>
        )}
      </div>

      {(discount || oldPrice) && (
        <div className="flex items-center gap-2">
          {discount && (
            <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white">
              {discount}
            </span>
          )}
          {oldPrice && (
            <span className="text-xs text-neutral-500 line-through">
              {oldPrice}
            </span>
          )}
        </div>
      )}

      <div className="mt-1">
        <p className="text-lg font-semibold text-neutral-900">{price}</p>
      </div>

      {(camera || shipping) && (
        <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
          <p>{camera}</p>
          <p>{shipping}</p>
        </div>
      )}
    </article>
  );
};
