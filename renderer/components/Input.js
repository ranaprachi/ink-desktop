import { default as styled } from 'styled-components';
import { Input as BootstrapInput} from '@bootstrap-styled/v4';

const Input = styled(BootstrapInput)`
  height: 45px;
  box-sizing: border-box;
  padding: 20px;
  border-radius: 8px;
  font-size: 14px;
`;

export default Input;
