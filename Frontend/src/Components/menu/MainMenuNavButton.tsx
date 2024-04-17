import Link from "next/link";

type MainMenuNavButtonProps = {
  text: string;
  image: string;
  link: string;
};

export default function MainMenuNavButton({
  text,
  image,
  link,
}: MainMenuNavButtonProps) {
  return (
    <div className="w-3/4 mx-auto">
      <div className="w-1/3 mx-auto">
        <Link href={link}>
          <div className="flex items-center mx-auto bg-gray-800 border-2 border-gray-600 p-6 rounded-lg shadow-md justify-start hover:bg-gray-600 flex-grow">
            <button className="flex items-center flex-grow">
              <img src={image} className="w-20 h-20 mr-4" alt="Large avatar" />
              <span className="text-xl font-bold  text-white">{text}</span>
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
