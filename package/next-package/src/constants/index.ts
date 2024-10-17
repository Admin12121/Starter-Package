import { AuthFormProps, SIGN_IN_FORM, SIGN_UP_FORM } from "./forms"
import {
  LANDING_PAGE_MENU,
  MenuProps,
} from "./menus"


type NextConstantsProps = {
  landingPageMenu: MenuProps[]
  signUpForm: AuthFormProps[]
  signInForm: AuthFormProps[]
}

export const Next_CONSTANTS: NextConstantsProps = {
  landingPageMenu: LANDING_PAGE_MENU,
  signUpForm: SIGN_UP_FORM,
  signInForm: SIGN_IN_FORM,
}
