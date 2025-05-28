export default function UserProfileBox() {
  return (
    <div className="flex items-center gap-2">
      <h3 className="flex flex-col items-end text-gray-800 text-sm font-base">
        Username <span className="font-light text-[12px]">Staff</span>
      </h3>
      <img src={""} alt="user profile" className="h-10 w-10 rounded-full border" />
    </div>
  );
}
