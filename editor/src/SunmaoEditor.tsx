import React, { useState, useMemo, useEffect } from 'react';
import { initSunmaoUIEditor } from '@sunmao-ui/editor';
import { type Application, type Module } from '@sunmao-ui/core';
import { fetchApp, fetchModules, saveApp, saveModules } from './services';
import config from '../../src/runtime.config';
import '@sunmao-ui/editor/dist/index.css';

type Props = {
  name: string;
};

export default function SunmaoEditor(props: Props) {
  const { name } = props;
  const [app, setApp] = useState<Application | undefined>();
  const [modules, setModules] = useState<Module[] | undefined>();

  const SunmaoEditor = useMemo(() => {
    if (!app || !modules) {
      return null;
    }
    return initSunmaoUIEditor({
      defaultApplication: app,
      defaultModules: modules,
      runtimeProps: config,
      storageHandler: {
        onSaveApp: function (app) {
          return saveApp(name, app);
        },
        onSaveModules: function (modules) {
          return saveModules(modules);
        },
      },
    });
  }, [app, modules, name]);

  useEffect(() => {
    (async function () {
      const [app, modules] = await Promise.all([fetchApp(name), fetchModules()]);

      setApp(app);
      setModules(modules);
    })();
  }, [name]);

  if (!SunmaoEditor) return null;
  return <SunmaoEditor.Editor />;
}
