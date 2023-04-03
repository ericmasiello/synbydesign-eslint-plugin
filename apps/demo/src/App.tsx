import "./App.css"; // should be OK
import "./App.scss"; // should be OK
import styles1 from "./App.module.css"; // should be OK
import styles2 from "./App.module.scss"; // should be OK

import "./Foo.css"; // Fail: different name
import "./Foo.scss"; // Fail: different name
import styles3 from "./Foo.module.css"; // Fail: different name
import styles4 from "./Foo.module.scss"; // Fail: different name

import "./other/directory/App.css"; // Fail: different directory
import "./other/directory/App.scss"; // Fail: different directory
import styles5 from "./other/directory/App.module.css"; //Fail: different directory
import styles6 from "./other/directory/App.module.scss"; // Fail: different directory

export const App = () => {
  return <div>Hello world</div>;
};
