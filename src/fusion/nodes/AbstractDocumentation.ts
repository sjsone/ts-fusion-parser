import { Comment } from "../../common/Comment";
import { AbstractStatement } from "./AbstractStatement";

export abstract class AbstractDocumentation extends Comment {
    protected followingStatement?: AbstractStatement
    protected followingComments: Comment[] = []


    setFollowingStatement(followingStatement: AbstractStatement) {
        this.followingStatement = followingStatement
    }

    addFollowingComments(...comments: Comment[]) {
        this.followingComments.push(...comments)
    }
} 