export function HomeFooter() {
  return (
    <footer data-section-type="footer" className="flex justify-between bg-[#FFFFFF] px-8 py-12">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-bold text-gray-900">printtie</span>
        <p className="text-sm text-[#6D28D9]">© 2026 printtie. All rights reserved.</p>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-gray-900">Company</p>
          <p className="text-sm text-[#6D28D9]">About</p>
          <p className="text-sm text-[#6D28D9]">Careers</p>
          <p className="text-sm text-[#6D28D9]">Contact</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-gray-900">Support</p>
          <p className="text-sm text-[#6D28D9]">Help Center</p>
          <p className="text-sm text-[#6D28D9]">Terms</p>
          <p className="text-sm text-[#6D28D9]">Privacy Policy</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-gray-900">For Artists</p>
          <p className="text-sm text-[#6D28D9]">How to Sell</p>
          <p className="text-sm text-[#6D28D9]">Fees & Payouts</p>
          <p className="text-sm text-[#6D28D9]">Guidelines</p>
        </div>
      </div>
    </footer>
  );
}
