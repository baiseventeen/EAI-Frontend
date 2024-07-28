import { Avatar, ConfigProvider, Menu, MenuProps } from 'antd';
import './index.scss';
import useStore from "@/store";

interface HeaderProps {
  items: MenuProps['items'];
  current?: string[];
  onChange: (...args: any) => void;
}

function Header({ items, current, onChange }: HeaderProps) {

  const store = useStore();

  function onClick(...args: any[]) {
    onChange?.(...args);
  }

  return <div className="header">
    <div className="header-icons">
      <div>
        Logo
      </div>
      <div>
        /name
      </div>
    </div>
    <div className="header-menu">
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              horizontalItemSelectedColor: '#597d3b',
              algorithm                  : true,
            },
          },
        }}
      >
        <Menu onClick={onClick} selectedKeys={current} mode="horizontal" items={items}/>
      </ConfigProvider>
    </div>
    {
      store.token !== '' ?
          <div className="header-userName">
            {
              store.user.userAvatar ?
                  <Avatar size={32} src={store.user.userAvatar} /> :
                    <Avatar size={32}>
                      user
                    </Avatar>
            }
            <div className="nickName">
              {store.user.name}
            </div>
          </div> :
          <div className="header-userName">
            <Avatar size={32}>
              user
            </Avatar>
            <div className="nickName">
              user
            </div>
          </div>
    }
  </div>;
}

export default Header;
