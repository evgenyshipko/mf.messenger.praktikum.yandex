import Component from '../utils/Component.js';
class Avatar extends Component {
    constructor(props) {
        super(props);
    }
    template() {
        return `<span class="profile-avatar__content" @event={{eventData}}>Изменить аватар</span>`;
    }
}
export default Avatar;
//# sourceMappingURL=Avatar.js.map