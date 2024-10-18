import React from "react"; 
import {Link} from "react-router-dom";
import { ContentLayout } from "./content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from "@/components/ui/breadcrumb";

interface BreadcrumbItemData {
  title: string;
  href?: string;
}

const Overlay = ({ children, breadcrumbs }: { children: React.ReactNode, breadcrumbs: BreadcrumbItemData[] }) => {
  return (
    <ContentLayout title="Categories" classname="pt-2">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.title}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </ContentLayout>
  )
}

export default Overlay;