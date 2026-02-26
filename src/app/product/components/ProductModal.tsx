import React, { FC } from "react";
import { Product } from "./ProductGrid";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export const ProductModal: FC<ProductModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const imgs =
    product.images && product.images.length
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : [];
  const [currentIdx, setCurrentIdx] = React.useState(0);

  // reset index when product changes
  React.useEffect(() => {
    setCurrentIdx(0);
  }, [product]);

  const currentImg = imgs[currentIdx] || product.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="relative mx-0 w-full max-h-screen overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:max-w-4xl sm:mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-neutral-500 hover:text-neutral-900"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row">
          {/* left: main image and thumbnails */}
          <div className="flex-1">
            <div className="aspect-3/5 w-full max-h-96 sm:max-h-none rounded-2xl bg-neutral-100 overflow-hidden relative">
              {currentIdx > 0 && (
                <button
                  onClick={() => setCurrentIdx((i) => i - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 hover:bg-white"
                >
                  ‹
                </button>
              )}
              {currentIdx < imgs.length - 1 && (
                <button
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 hover:bg-white"
                >
                  ›
                </button>
              )}
              <img
                src={currentImg}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            {imgs.length > 1 && (
              <div className="mt-3 sm:mt-4 flex gap-1 sm:gap-2 overflow-x-auto pb-2">
                {imgs.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-12 w-12 sm:h-14 sm:w-14 flex-none rounded-lg sm:rounded-xl bg-neutral-100 overflow-hidden focus:outline-none transition-all ${
                      idx === currentIdx ? "ring-2 ring-neutral-900" : ""
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* right: details */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4">
            {product.category && (
              <span className="text-xs uppercase text-neutral-500">
                {product.category}
              </span>
            )}
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">
              {product.name}
            </h2>
            {product.inStock !== undefined && (
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  product.inStock
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of stock"}
              </span>
            )}
            {product.rating !== undefined && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-yellow-500">
                {/* simple star icons */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    fill={
                      i < Math.round(product.rating || 0)
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.374 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.374-2.455a1 1 0 00-1.175 0l-3.374 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.98 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
                    />
                  </svg>
                ))}
                {product.reviewCount !== undefined && (
                  <span className="text-neutral-600">
                    {product.reviewCount} Reviews
                  </span>
                )}
              </div>
            )}
            {product.description && (
              <p className="text-xs sm:text-sm text-neutral-700">{product.description}</p>
            )}

            {/* price section */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {(product.discount || product.oldPrice) && (
                <div className="flex items-center gap-2">
                  {product.discount && (
                    <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white">
                      {product.discount}
                    </span>
                  )}
                  {product.oldPrice && (
                    <span className="text-xs text-neutral-500 line-through">
                      {product.oldPrice}
                    </span>
                  )}
                </div>
              )}
              <span className="text-xl sm:text-2xl font-semibold text-neutral-900">
                {product.price}
              </span>
            </div>

            {/* actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 rounded-full bg-neutral-900 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white">
                ADD TO CART
              </button>
              <button className="rounded-full border border-neutral-300 p-2 text-neutral-900">
                {/* heart icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.682l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  />
                </svg>
              </button>
            </div>

            {/* info list */}
            <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm text-neutral-700">
              {product.shipping && (
                <li className="flex items-start gap-2">
                  {/* globe icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 0v8m-4 0h8"
                    />
                  </svg>
                  <span>Shipping Information: {product.shipping}</span>
                </li>
              )}
              {product.warranty && (
                <li className="flex items-start gap-2">
                  {/* file icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2z"
                    />
                  </svg>
                  <span>Warranty Information: {product.warranty}</span>
                </li>
              )}
              {product.returnPolicy && (
                <li className="flex items-start gap-2">
                  {/* file icon reused */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-500 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2z"
                    />
                  </svg>
                  <span>Return Policy: {product.returnPolicy}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
