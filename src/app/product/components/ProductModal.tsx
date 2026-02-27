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

        <div className="flex flex-col gap-6 sm:gap-8 sm:flex-row">
          {/* left: main image and thumbnails */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            {/* main image */}
            <div className="aspect-3/4 w-full rounded-3xl bg-neutral-100 overflow-hidden relative flex items-center justify-center">
              {currentIdx > 0 && (
                <button
                  onClick={() => setCurrentIdx((i) => i - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 hover:bg-neutral-100 transition-colors shadow-md"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6 text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              {currentIdx < imgs.length - 1 && (
                <button
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 hover:bg-neutral-100 transition-colors shadow-md"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6 text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
              <img
                src={currentImg}
                alt={product.name}
                className="h-full w-full object-contain p-4"
              />
            </div>

            {/* thumbnails */}
            {imgs.length > 1 && (
              <div className="flex gap-3 justify-center">
                {imgs.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-20 w-20 flex-none rounded-2xl overflow-hidden focus:outline-none transition-all ${
                      idx === currentIdx
                        ? "ring-1 ring-neutral-900"
                        : "border border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="h-full w-full object-contain bg-neutral-50 transition-transform duration-300 hover:scale-110"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* right: details */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-5">
            {product.category && (
              <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                {product.category}
              </span>
            )}
            
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {product.name}
            </h2>

            {product.inStock !== undefined && (
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold w-fit ${
                  product.inStock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.inStock ? "In stock" : "Out of stock"}
              </span>
            )}

            {product.rating !== undefined && (
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
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
                <span className="text-sm font-semibold text-neutral-900">
                  {product.rating}
                </span>
                <span className="text-sm text-neutral-500">
                  | {product.reviewCount} Reviews
                </span>
              </div>
            )}

            {product.description && (
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* price section */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {product.discount && (
                <span className="inline-flex bg-neutral-900 text-white text-xs font-bold px-2.5 py-1 rounded">
                  {product.discount}
                </span>
              )}
              {product.oldPrice && (
                <span className="text-sm text-neutral-500 line-through">
                  {product.oldPrice}
                </span>
              )}
              <span className="w-full text-3xl font-bold text-neutral-900">
                {product.price}
              </span>
            </div>

            {/* actions */}
            <div className="flex items-center gap-3 pt-2">
              <button className="flex-1 rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white hover:bg-neutral-800 transition-colors">
                ADD TO CART
              </button>
              <button className="rounded-full border-2 border-neutral-300 p-3 text-neutral-900 hover:bg-neutral-50 transition-colors">
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
            <ul className="mt-6 space-y-3 pt-0">
              {product.shipping && (
                <li className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-600 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-600">Shipping Information</span>
                    <span className="text-sm text-neutral-700">{product.shipping}</span>
                  </div>
                </li>
              )}
              {product.warranty && (
                <li className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-600 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m7 4a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-600">Warranty Information</span>
                    <span className="text-sm text-neutral-700">{product.warranty}</span>
                  </div>
                </li>
              )}
              {product.returnPolicy && (
                <li className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-600 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 15L3 9m0 0l6-6m-6 6h18"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-600">Return Policy</span>
                    <span className="text-sm text-neutral-700">{product.returnPolicy}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
