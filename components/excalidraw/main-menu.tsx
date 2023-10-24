import { MainMenu } from '@excalidraw/excalidraw';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GoCloud, GoHome } from 'react-icons/go';

export interface MainMenuProps {
  mobileOnlyComponents?: React.ReactNode;
  isAuthed?: boolean;
}

const MainMenuComponent: React.FC<MainMenuProps> = (props) => {
  const {} = props;
  const router = useRouter();

  return (
    <MainMenu>
      <MainMenu.Group title="Canvas">
        <MainMenu.DefaultItems.ChangeCanvasBackground />
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.DefaultItems.ToggleTheme />
      </MainMenu.Group>
      <MainMenu.Group title="Scene">
        {props.isAuthed && (
          <MainMenu.Item
            onSelect={() => router.push('/')}
            shortcut="Ctrl+Shift+Q"
            icon={<GoHome />}
          >
            Dashboard
          </MainMenu.Item>
        )}
        {!props.isAuthed && (
          <MainMenu.Item onSelect={() => signIn()} icon={<GoCloud />}>
            Save Online
          </MainMenu.Item>
        )}
        {props.mobileOnlyComponents}
        <MainMenu.DefaultItems.LoadScene />
        <MainMenu.DefaultItems.SaveToActiveFile />
        <MainMenu.DefaultItems.Export />
      </MainMenu.Group>
      <MainMenu.Group title="Export">
        <MainMenu.DefaultItems.SaveAsImage />
      </MainMenu.Group>
    </MainMenu>
  );
};

export default MainMenuComponent;
