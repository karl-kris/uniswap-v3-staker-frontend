import { render } from 'react-dom';

import App from 'components/global/App';
import './styles';

import 'i18n';

(async () => {
  render(<App />, document.getElementById('root'));
})();
