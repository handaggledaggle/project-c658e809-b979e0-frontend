export function HomeFooter() {
  return (
    <footer data-section-type="footer" className="flex justify-between py-12 px-8 bg-[#FFFFFF]">
      <div className="flex flex-col gap-2">
        <span className="text-lg font-bold text-gray-900">printtie</span>
        <p className="text-[#6D28D9] text-sm">© 2026 printtie. All rights reserved.</p>
      </div>

      <div className="flex gap-12">
        <div className="flex flex-col gap-2">
          <p className="text-gray-900 font-semibold">Company</p>
          <p className="text-[#6D28D9] text-sm">About</p>
          <p className="text-[#6D28D9] text-sm">Careers</p>
          <p className="text-[#6D28D9] text-sm">Contact</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-gray-900 font-semibold">Support</p>
          <p className="text-[#6D28D9] text-sm">Help Center</p>
          <p className="text-[#6D28D9] text-sm">Terms</p>
          <p className="text-[#6D28D9] text-sm">Privacy Policy</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-gray-900 font-semibold">For Artists</p>
          <p className="text-[#6D28D9] text-sm">How to Sell</p>
          <p className="text-[#6D28D9] text-sm">Fees & Payouts</p>
          <p className="text-[#6D28D9] text-sm">Guidelines</p>
        </div>
      </div>
    </footer>
  );
}
