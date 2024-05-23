import ScrollAnimationWrapper from "./scroll-animation-wrapper";
import { motion } from "framer-motion";
import { servicesNumber } from "../constant/service-number";
import getScrollAnimation from "./utils/getAllAnimation";
import { useMemo } from "react";

interface ServiceNumberType {
  name: string;
  number: string;
  id: number;
  icon: string;
}
export function ServiceNumber() {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);
  return (
    <div>
      <ScrollAnimationWrapper className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 pt-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-200 bg-white-500 z-10">
        {servicesNumber?.map((item: ServiceNumberType) => (
          <motion.div
            className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
            key={item.id}
            custom={{ duration: 2 + item.id }}
            variants={scrollAnimation}
          >
            <div className="flex mx-auto w-40 sm:w-auto">
              <div className="flex items-center justify-center bg-slate-100 w-12 h-12 mr-6 rounded-full">
                <img src={item.icon} className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <p className="text-xl text-black-600 font-bold">
                  {item.number}+
                </p>
                <p className="text-lg text-black-500">{item.name}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </ScrollAnimationWrapper>
    </div>
  );
}

//  ServiceNumber;

//   <ScrollAnimationWrapper className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 py-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-100 bg-white-500 z-10">
//     {servicesNumber.map(({ listUsers, index }: any) => (
//       <motion.div
//         className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
//         key={index}
//         custom={{ duration: 2 + index }}
//         //   variants={scrollAnimation}
//       >
//         <div className="flex mx-auto w-40 sm:w-auto">
//           <div className="flex items-center justify-center bg-orange-100 w-12 h-12 mr-6 rounded-full">
//             {/* <img src={listUsers.icon} className="h-6 w-6" /> */}
//           </div>
//           <div className="flex flex-col">
//             <p className="text-xl text-black-600 font-bold">
//               {listUsers.number}+
//             </p>
//             <p className="text-lg text-black-500">{listUsers.name}</p>
//           </div>
//         </div>
//       </motion.div>
//     ))}
//   </ScrollAnimationWrapper>;
