import { useTheme } from "next-themes";

const Footer = () => {
  const { theme, setTheme } = useTheme();

  return (
    <footer className={"border-t-2 border-solid border-gray-100 dark:border-gray-900 lg:mb-4 py-2 px-2 lg:px-[15vw]"}>
      <a
        href="https://renakaagusta.dev"
        rel="noopener noreferrer"
        target="_blank"
        className={"text-gray-400"}
      >
        Built by renakaagusta
      </a>
    </footer>
  );
};

export default Footer;
