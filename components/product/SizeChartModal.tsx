'use client';

import { X, Ruler } from 'lucide-react';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-slate-900">
              <Ruler className="w-5 h-5 text-brand-600" />
              <h3 className="text-lg font-bold">Bảng Quy Đổi Kích Cỡ (Size Chart)</h3>
            </div>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs text-slate-600">
            <p>Bảng thông số kích thước chuẩn Việt Nam cho các dòng áo và quần nam/nữ tại CLOTHES SHOP:</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chiều cao (cm)</th>
                    <th className="p-2.5">Cân nặng (kg)</th>
                    <th className="p-2.5">Vòng ngực (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2.5 font-bold text-brand-700">S</td>
                    <td className="p-2.5">155 - 165</td>
                    <td className="p-2.5">48 - 55</td>
                    <td className="p-2.5">84 - 88</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-brand-700">M</td>
                    <td className="p-2.5">165 - 172</td>
                    <td className="p-2.5">56 - 65</td>
                    <td className="p-2.5">88 - 92</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-brand-700">L</td>
                    <td className="p-2.5">172 - 177</td>
                    <td className="p-2.5">66 - 75</td>
                    <td className="p-2.5">92 - 96</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-brand-700">XL</td>
                    <td className="p-2.5">177 - 183</td>
                    <td className="p-2.5">76 - 85</td>
                    <td className="p-2.5">96 - 102</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-brand-700">XXL</td>
                    <td className="p-2.5">183 - 190</td>
                    <td className="p-2.5">86 - 95</td>
                    <td className="p-2.5">102 - 110</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3 rounded-lg text-[11px] leading-relaxed">
              💡 <strong>Mẹo chọn size:</strong> Nếu thông số của bạn ở giữa 2 size, nên chọn <strong>size lớn hơn</strong> để thoải mái vận động (đặc biệt đối với các dòng form rộng Oversized).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
