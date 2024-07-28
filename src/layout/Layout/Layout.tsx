import { AppContext } from '@/context/AppContext';
import React, { useState } from 'react';
import Header from '../Header/Header';
import './index.scss';

interface LayoutProps {
  children: (current: string) => React.ReactNode;
}

const items = [
  {
    label: '课程广场',
    key  : 'square',
  },
  {
    label: '我的课程',
    key  : 'course',
  },
  {
    label: '我的作业',
    key  : 'work',
  },
];


// 简单的三段式布局
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [current, setCurrent] = useState(['square']);
  const [onSetCurrent, setOnSetCurrent] = useState<Function | null>(null);

  function onChange({ key }: { key: string }) {
    const res = current[0];
    if (res === 'work') {
      const current = () => () => {
        setCurrent([key]);
        setOnSetCurrent(null);
        return void 0;
      };
      // @ts-ignore
      setOnSetCurrent(current);
      return;
    }
    setCurrent([key]);
  }

  return (
    // 监听onSetCurrent变化出现弹出离开 调用设置
    <AppContext.Provider value={{ current, onSetCurrent }}>
      <div className="app">
        <Header items={items} onChange={onChange} current={current}></Header>
        {children(current[0])}
      </div>
    </AppContext.Provider>
  );
};

export default Layout;
