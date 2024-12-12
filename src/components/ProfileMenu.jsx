import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Menu as BaseMenu } from "@mui/base/Menu";
import { MenuButton as BaseMenuButton } from "@mui/base/MenuButton";
import { MenuItem as BaseMenuItem } from "@mui/base/MenuItem";
import { Dropdown } from "@mui/base/Dropdown";
import { redirect } from "next/navigation";
import { Switch } from "@mui/joy";
import { toggleTheme } from "@/utils/ThemeToggle";
import { UIStore } from "@/store/UIStore";
import { AuthStore } from "@/store/AuthStore";
import { successToast } from "./ToasterProvider";

export default function ProfileMenu({ children }) {
  const {
    darkModeOn,
    toggleDarkMode,
    expectedVersion,
    setExpectedVersion,
    setIsExpectedVersionModalOpen,
  } = UIStore();
  const { Logout } = AuthStore();

  const createHandleMenuClick = (menuItem) => {
    return async () => {
      if (menuItem === "Profile") {
        redirect("/profile");
        // Navigate to the profile page
      } else if (menuItem === "DarkMode") {
        toggleTheme(toggleDarkMode);
        // Navigate to the profile page
      } else if (menuItem === "Logout") {
        await Logout();
        redirect("/landing-page");
      } else if (menuItem === "ExpectedVersion") {
        if (expectedVersion) {
          successToast("Expected Version Deactivated");
          return setExpectedVersion(false);
        }
        setIsExpectedVersionModalOpen(true);
      }
    };
  };

  return (
    <div>
      {/* <div className={`dark`}> */}
      <Dropdown>
        <MenuButton>{children}</MenuButton>
        <Menu>
          <MenuItem onClick={createHandleMenuClick("Profile")}>
            View Profile
          </MenuItem>
          {/* <MenuItem onClick={createHandleMenuClick('Language settings')}>
            Language settings
          </MenuItem> */}
          <MenuItem onClick={createHandleMenuClick("DarkMode")}>
            <div className="flex items-center gap-2">
              Dark Mode <Switch checked={darkModeOn} />
            </div>
          </MenuItem>
          <MenuItem onClick={createHandleMenuClick("ExpectedVersion")}>
            <div className="flex items-center gap-2">
              Expected Version <Switch checked={expectedVersion} />
            </div>
          </MenuItem>
          <MenuItem onClick={createHandleMenuClick("Logout")}>
            <h1 className="text-red-600 font-bold">Log out</h1>
          </MenuItem>
        </Menu>
      </Dropdown>
    </div>
  );
}

const resolveSlotProps = (fn, args) =>
  typeof fn === "function" ? fn(args) : fn;

const Menu = forwardRef((props, ref) => {
  return (
    <BaseMenu
      ref={ref}
      {...props}
      slotProps={{
        ...props.slotProps,
        root: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.root,
            ownerState
          );
          return {
            ...resolvedSlotProps,
            className: clsx(`z-10`, resolvedSlotProps?.className),
          };
        },
        listbox: (ownerState) => {
          const resolvedSlotProps = resolveSlotProps(
            props.slotProps?.listbox,
            ownerState
          );
          return {
            ...resolvedSlotProps,
            className: clsx(
              "text-sm box-border font-sans p-1.5 my-3 me-1 mx-0 rounded-xl overflow-auto outline-0 bg-white dark:bg-slate-900 border border-solid border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-300 min-w-listbox shadow-md dark:shadow-slate-900",
              resolvedSlotProps?.className
            ),
          };
        },
      }}
    />
  );
});

Menu.displayName = "Menu";

Menu.propTypes = {
  /**
   * The props used for each slot inside the Menu.
   * @default {}
   */
  slotProps: PropTypes.shape({
    listbox: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    root: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  }),
};

const MenuButton = forwardRef((props, ref) => {
  const { className, ...other } = props;
  return (
    <BaseMenuButton
      ref={ref}
      className={clsx(
        "cursor-pointer text-sm font-sans box-border font-semibold rounded-xl my-1 text-slate-900 dark:text-slate-200 focus-visible:shadow-[0_0_0_4px_#ddd6fe] dark:focus-visible:shadow-[0_0_0_4px_#a78bfa] focus-visible:outline-none shadow-sm active:shadow-none",
        className
      )}
      {...other}
    />
  );
});

MenuButton.displayName = "MenuButton";

MenuButton.propTypes = {
  /**
   * Class name applied to the root element.
   */
  className: PropTypes.string,
};

const MenuItem = forwardRef((props, ref) => {
  const { className, ...other } = props;
  return (
    <BaseMenuItem
      ref={ref}
      className={clsx(
        "list-none p-2 rounded-lg cursor-default select-none last-of-type:border-b-0 focus:shadow-outline-purple focus:outline-0 focus:bg-slate-100 focus:dark:bg-slate-800 focus:text-slate-900 focus:dark:text-slate-300 disabled:text-slate-400 disabled:dark:text-slate-700 disabled:hover:text-slate-400 disabled:hover:dark:text-slate-700",
        className
      )}
      {...other}
    />
  );
});

MenuItem.displayName = "MenuItem";

MenuItem.propTypes = {
  className: PropTypes.string,
};
