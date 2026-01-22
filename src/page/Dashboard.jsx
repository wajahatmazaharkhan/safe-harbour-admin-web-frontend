import { PageNavigatorStatus } from "../components";
import useTitle from "../hooks/useTitle";

const Dashboard = () => {
  let title = "Dashboard";
  useTitle(title);
  return (
    <div>
      <PageNavigatorStatus title={title} />
    </div>
  );
};

export default Dashboard;
