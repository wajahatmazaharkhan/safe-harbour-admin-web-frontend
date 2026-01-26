import { House } from "lucide-react";
import { Link } from "react-router-dom";

const PageNavigatorStatus = ({ title }) => {
  return (
    <div className="ml-5 mt-5">
      <div className="flex">
        <Link to={"/"}>
          <House size={20} />
        </Link>
        &nbsp; / <span className="underline mx-1 cursor-pointer">{title}</span>
      </div>
    </div>
  );
};

export default PageNavigatorStatus;
