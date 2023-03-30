import "./App.css"; // should be OK
import "./App.scss"; // should be OK
import "./App.module.css"; // should be OK
import "./App.moulde.scss"; // should be OK

import "./Foo.css"; // should fail
import "./Foo.scss"; // should fail
import "./Foo.module.css"; // should fail
import "./Foo.module.scss"; // should fail

export const App = () => {
  return <div>Hello world</div>;
};
