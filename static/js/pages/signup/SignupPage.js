import Component from '../../utils/Component.js';
class SignupPage extends Component {
    constructor(props) {
        super(props);
    }
    template() {
        return `
            <div class='signup-wrapper'>
              <div class='signup'>
                <p class='signup-header'>Регистрация</p>
                <div>{{form}}</div>
                <div>{{entranceBtn}}</div>
              </div>
            </div>`;
    }
}
export default SignupPage;
//# sourceMappingURL=SignupPage.js.map